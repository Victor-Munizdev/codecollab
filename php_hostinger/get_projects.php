<?php
header("Content-Type: application/json");

// Inclui o arquivo de conexão com o banco de dados
require_once '../db_connect.php'; // Ajuste o caminho conforme necessário

$response = [
    'success' => false,
    'message' => '',
    'data' => []
];

// Verifica se a conexão foi bem-sucedida
if ($conn->connect_error) {
    $response['message'] = "Erro de conexão com o banco de dados: " . $conn->connect_error;
    echo json_encode($response);
    exit();
}

// Prepara e executa a consulta SQL
$sql = "SELECT id, name, description, owner_id, owner_email, collaborators, created_at FROM projects";
$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        $projects = [];
        while($row = $result->fetch_assoc()) {
            // Decodifica a string JSON de colaboradores para um array PHP
            $row['collaborators'] = json_decode($row['collaborators'], true);
            $projects[] = $row;
        }
        $response['success'] = true;
        $response['message'] = "Projetos buscados com sucesso.";
        $response['data'] = $projects;
    } else {
        $response['success'] = true;
        $response['message'] = "Nenhum projeto encontrado.";
    }
} else {
    $response['message'] = "Erro na consulta SQL: " . $conn->error;
}

// Fecha a conexão
$conn->close();

// Retorna a resposta em formato JSON
echo json_encode($response);

?>