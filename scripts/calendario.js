$('document').ready(function() {

    closeModals();

    $('#overlay').click(function() {
        hideModals();
    });

    $('#editButton').click(function() {
        closeModals();
        $('#overlay').fadeIn();
        $('#editModal').fadeIn();

    });

    $('#deleteButton').click(function() {
        let id = $(this).data('id');
        let type = $(this).data('type');
        deleteEvent(id, type);
    });

    $('#submitUpdate').click(function(event) { 
        event.preventDefault();
        
        let formData = $('#editForm').serialize();
        let type = $(this).data('type');
        let id = $(this).data('id');

        $.ajax({
            url: '',
            type: 'POST',
            data: `action=update&${formData}&type=${type}&id=${id}`,
            success: function(response) {
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error('Error adding task:', error);
            }
        });
    });

    $('#completed').change(function() {
        $.ajax({
            type: 'POST',
            url: '',
            data: `action=change-status&${$('#completeForm').serialize()}`,
            success: function(data) {
                console.info('Form submitted successfully', data);

                setStatus({ status: data, type: 'TASK' })
            }
        });
    });
    


});


// Função para deletar uma tarefa
function deleteEvent(id, type) {
  if (confirm("Tem certeza que deseja deletar este item?")) {
      fetch('', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `action=delete&type=${type}&task_id=${id}`
      })
      .then(data => {
          location.reload();
      })
      .catch(error => console.error('Erro:', error));
  }
}



// Exemplo de uso: adicionar eventos de clique nas tarefas do calendário para editar ou deletar
// document.addEventListener('DOMContentLoaded', function() {
//   document.querySelectorAll('.calendar-task').forEach(task => {
//       task.addEventListener('click', function() {
//           const taskId = this.getAttribute('data-task-id');
//           const taskTitle = prompt("Editar título da tarefa:", this.getAttribute('data-task-title'));
//           const taskStartDate = prompt("Editar data de início (YYYY-MM-DD):", this.getAttribute('data-start-date'));
//           const taskEndDate = prompt("Editar data de término (YYYY-MM-DD):", this.getAttribute('data-end-date'));

//           if (taskTitle && taskStartDate && taskEndDate) {
//               updateTask(taskId, taskTitle, taskStartDate, taskEndDate);
//           }
//       });

//       task.querySelector('.delete-btn').addEventListener('click', function(event) {
//           event.stopPropagation();
//           const taskId = task.getAttribute('data-task-id');
//           deleteTask(taskId);
//       });
//   });
// });





function openDetails(details) {
    closeModals();

    $('#overlay').fadeIn();
    $('#detailsModal').fadeIn();

    if(details.type === "TASK") {
        $('#completeForm').removeClass('hidden');
        $('#type').text('Task')
    }
    else {
        $('#completeForm').addClass('hidden');
        $('#type').text('Projeto');
    }

    setStatus(details);
    setPriority(details);

    $('#eventDetails').text(details.title);
    $('#description').text(details.description || "Não disponível");
    $('#createdAt').text(details.createdAt || "Não disponível");
    $('#startDate').text(details.startDate || "Não disponível");
    $('#endDate').text(details.endDate || "Não disponível");
    $('#projectId').val(details.projectId || 0);
    $('#taskId').val(details.id || 0);
    $('#completed').prop('checked', details.status === 1);


    $('#submitUpdate').data('id', details.id);
    $('#submitUpdate').data('type', details.type);
    $('#deleteButton').data('id', details.id);
    $('#deleteButton').data('type', details.type);

    $('#editButton').click(() => { showEditModal(details) });

}


function showEditModal(details) {
    closeModals();
    $('#overlay').fadeIn();
    $('#editModal').fadeIn();

    if(details.type === "TASK") {
        $('#nameRow').addClass('hidden');
        $('#statusRow').addClass('hidden');
    }
    else {
        $('#nameRow').removeClass('hidden');
        $('#statusRow').removeClass('hidden');    
    }

    $('input#name').val(details.title || "Não disponível");
    $('textarea#description').val(details.description || details.title || "Não disponível");
    $('input#createdAt').val(details.createdAt || "Não disponível");
    $('input#startDate').val(details.startDate || "Não disponível");
    $('input#endDate').val(details.endDate || "Não disponível");
    $('select#priority').val(Number(details.priority) || 0);
    $('select#status').val(Number(details.status) || 0);
};

function closeModals() { 
    resetEditForm();
    $('#overlay').hide(); 
    $('#detailsModal').hide();
    $('#editModal').hide();
}

function hideModals() {  
    resetEditForm(); 
    $('#overlay').fadeOut();
    $('#detailsModal').fadeOut();
    $('#editModal').fadeOut();
}

function resetEditForm() {
    $('#editForm input[type="text"]').val('');
    $('#editForm textarea').val('');
    $('#editForm select').val('');
}

function setStatus(details) {

    const statuses = [
        { title: 'Backlog', color: 'info' },
        { title: 'Em progresso', color: 'secondary' },
        { title: 'Concluído', color: 'success' },
        { title: 'Parado', color: 'warning' },
        { title: 'Atrasado', color: 'danger' },
        { title: 'Cancelado', color: 'neutral' },
    ]

    if(details.type === "PROJECT") {
        const index = Number(details.status) -1;
        
        $('#status').text(statuses[index].title);
        $('#status').addClass(`status ${statuses[index].color}`);

    }
    else {
        $('#status').attr('class', '');
        $('#status').text(Number(details.status) === 0? 'Em progresso' : 'Concluído');
        $('#status').addClass(Number(details.status) === 0? 'status secondary' : 'status success');

    }
}

function setPriority(details){
    const priorities = [
        { title: 'Baixa', color: 'neutral' },
        { title: 'Média', color: 'success' },
        { title: 'Alta', color: 'warning' },
        { title: 'Crítica', color: 'danger' },
    ]

    if(details.priority) {
        const index = Number(details.priority) -1;
        
        $('#priority').text(priorities[index].title);
        $('#priority').addClass(`status ${priorities[index].color}`);
    }
    else {
        $('#priority').text('Não disponivel');    
    }

}