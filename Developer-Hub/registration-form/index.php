<?php
    require_once 'config_session.php';
    require_once 'signup_view.php';
    require_once 'login_view.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .container {
            text-align: center;
            background: aliceblue;
            display: block;
            justify-content: center;
        }
        h3 {
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 600;
        }
        input, button {
            margin: 6px;
            width: 200px;
        }
        form {
            padding: 12px;
            background-color: white;
            height: auto;
        }
        .form-error {
            color: red;
        }
        .form-success {
            color: green;
        } 
    </style>
</head>
<body>
    <h3>
        <?php
         output_username() 
        ?>
    </h3>
    
    <div class="container">
        <h3>Login</h3><br>
        <form action="login.php" method="post">
            <input type="text" name="username"  placeholder="Full Name"><br>
            <input type="password" name="password" placeholder="Enter Password"><br>
            <button>Login</button>
        </form> 
        <?php
            check_login_errors(); 
        ?>
        

        
        <h3>Signup</h3><br>
        <form action="signup.php" method="post">
            <?php 
                signup_inputs(); 
            ?>
            <button>Signup</button>
        </form>
        <?php
            check_signup_errors(); 
        ?>

        <h3>Logout</h3><br>
        <form action="logout.php" method="post">
            
            <button>Logout</button>
        </form> 
    </div>



</body>
</html>