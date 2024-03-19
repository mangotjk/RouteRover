<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="s" uri="/struts-tags" %>

<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Route Rover Main Page</title>
  </head>
    <body bgColor="lightBlue">
    <h1>Welcome To Route Rover!</h1>
    <h2>Creators: jk, [add your names], </h2>

    <p><a href="<s:url action='hello'/>">Hello World</a></p>
    <p><a href="<s:url action='map'/>">map</a></p>
    <p><a href="<s:url action='mapSearch'/>">mapSearch</a></p>

    <s:form action="Login">
        <s:textfield name="userName" label="User Name" placeholder="enter 'Bob123' to login"/>
        <s:password name="password" label="Password" />
        <s:textfield name="phoneNumber" label="Phone Number" placeholder="8 digit phone number"/>
        <s:textfield name="email" label="Email" type="email" />
        <s:submit value="Login" />
    </s:form>
  </body>
</html>
