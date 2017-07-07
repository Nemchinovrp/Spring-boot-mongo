<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta http-equiv="CONTENT-TYPE" content="text/html" ; charset="UTF-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="/resources/css/timezones.css" />
    <title>Login Page</title>
</head>
<body>
<div class="container" style="padding:200px 0">
    <div class="row">
        <div class="col-md-4"></div>
        <div class="col-md-4">
            <form method="post" action="/hello">
                <input type="email" name="email" placeholder="Email" required class="form-control input-lg"/>
                <input type="password" name="password" class="form-control input-lg" placeholder="Password"
                       required=""/>
                <button type="submit" name="go" class="btn btn-lg btn-success btn-block">Войти</button>
                <div class="checkbox">
                    <label><input type="checkbox" value="remember" name="remember">Запомнить меня</label>
                </div>
            </form>
            <form action="registration">
                <a href="/registration">Регистрация</a>
            </form>
        </div>
        <div class="col-md-4"></div>
    </div>
</div>
</body>
</html>
