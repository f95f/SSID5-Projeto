<?php

require_once('database/conn.php');

class ProjectService {
    private $sql;
    private $pdo;
    
    function __construct() {
        $this->pdo = require 'database/conn.php';
    }

    public function getAllProjects() {
        $project = [];
        $query = 'select * from tb_project';
        try{
            $this -> sql = $this->pdo->query($query);
            if($this -> sql -> rowCount() > 0) {
                $project = $this -> sql -> fetchAll(PDO::FETCH_ASSOC);
            }
            return $project;
        } catch (PDOException $e) {
            throw new Exception("Error fetching project: " . $e->getMessage());
        }
    }

    public function getProjectById($projectId) {
        $query = 'SELECT * FROM tb_project WHERE id = :id';
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->bindValue(':id', $projectId, PDO::PARAM_INT);
            $stmt->execute();
            $project = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return $project;
        } catch (PDOException $e) {
            throw new Exception("Error fetching project: " . $e->getMessage());
        }
    }

    public function createProject($project) {

        print_r($project);
        print_r($project -> getProjectName());
        $query = '
            INSERT INTO tb_project 
                (project_name, project_priority, project_status, created_at, deadline) 
            VALUES 
                (:name, :priority, :status, :createdAt, :deadline)';

        try {
            $sql = $this->pdo->prepare($query);
            $sql->bindValue(':name', $project -> getProjectName());
            $sql->bindValue(':priority', $project -> getProjectPriority());
            $sql->bindValue(':status', $project -> getProjectStatus());
            $sql->bindValue(':createdAt', $project -> getCreatedAt());
            $sql->bindValue(':deadline', $project -> getDeadline());
            return $sql->execute();
        } catch (PDOException $e) {
            throw new Exception("Error creating project: " . $e->getMessage());
        }
    }

    public function updateProject($projectId, $project) {
        $query = 'update tb_project set project_description = :description where id = :id';
        try{
            $sql = $this->pdo->prepare($query);
            $sql->bindValue(':description', $project);
            $sql->bindValue(':id', $projectId);
            return $sql->execute();
        } catch (PDOException $e) {
            throw new Exception("Error updating project: " . $e->getMessage());
        }
    }

    public function deleteProject($projectId) {
        try{
            $query = 'delete from tb_project where id = :id';
            $sql = $this->pdo->prepare($query);
            $sql->bindValue(':id', $projectId);
            return $sql->execute();
        } catch (PDOException $e) {
            throw new Exception("Error deleting project: " . $e->getMessage());
        }
    }

    public function changeProjectStatus($projectId, $status) {
        $project = $this -> getProjectById($projectId);
            
        error_log(json_encode($project));
        try {
            $query = 'update tb_project set status = :status where id = :id';
            $sql = $this->pdo->prepare($query);
            $sql->bindValue(':status', $status);
            $sql->bindValue(':id', $projectId);
            return $sql->execute();
        } catch (PDOException $e) {
            throw new Exception("Error updating project: " . $e->getMessage());
        }
    }

}

return new ProjectService();