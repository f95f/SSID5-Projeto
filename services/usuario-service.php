<?php

require_once __DIR__ . '/../database/conn.php';

class UsuarioService {
    private $sql;
    private $pdo;
    
    function __construct() {
        $this->pdo = require __DIR__ . '/../database/conn.php';
    }
    
    public function login($email, $senha) {

        try{
            $query = 'SELECT * FROM tb_user WHERE email = "' . $email . '" AND senha = "' . $senha . '"';
            error_log($query);
            $sql = $this->pdo->query($query);
            $result = $sql->fetchAll(PDO::FETCH_ASSOC);
            //print_r($result);
            return $result;
        } catch (PDOException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
    
    // public function login($email, $senha) {

    //     $query = 'select * from tb_user where email = :email and senha = :senha';
    //     $sql = $this->pdo->prepare($query);
    //     $sql->bindValue(':email', $email);
    //     $sql->bindValue(':senha', $senha);

    //     try{
    //         $sql->execute();
    //         $result = $sql->fetchAll(PDO::FETCH_ASSOC);
    //         return $result;
    //     } catch (PDOException $e) {
    //         throw new Exception("Error logging in: " . $e->getMessage());
    //     }
    // }

    public function signup($nome, $email, $senha) {

        $query = 'insert into tb_user (name, email, senha) values (:nome, :email, :senha)';
        $sql = $this->pdo->prepare($query);
        $sql->bindValue(':nome', $nome);
        $sql->bindValue(':email', $email);
        $sql->bindValue(':senha', $senha);

        try{
            return $sql->execute();
        } catch (PDOException $e) {
            throw new Exception("Error signing up: " . $e->getMessage());
        }
    }


    public function getDeadlinePreferences($userId) {

        $query = 'select daysBeforeDeadline from tb_user where id = :userId';
        $sql = $this->pdo->prepare($query);
        $sql->bindValue(':userId', $userId);
    
        try{
            $sql->execute();
            $result = $sql->fetch();
            return $result['daysBeforeDeadline'];
        } catch (PDOException $e) {
            throw new Exception("Error signing up: " . $e->getMessage());
        }
    }
    

    public function setDeadlinePreferences($id, $daysBeforeDeadline) {
        
        $query = 'update tb_user set daysBeforeDeadline = :daysBeforeDeadline where id = :userId';
        $sql = $this->pdo->prepare($query);
        $sql->bindValue(':userId', $id);
        $sql->bindValue(':daysBeforeDeadline', $daysBeforeDeadline);

        try{
            return $sql->execute();
        } catch (PDOException $e) {
            throw new Exception("Error signing up: " . $e->getMessage());
        }
    }
}

return new UsuarioService();