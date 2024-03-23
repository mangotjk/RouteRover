<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="s" uri="/struts-tags" %>

<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Provide Feedback</title>
  </head>
    <body>
    <h1>Feedback: </h1>

    <s:form action="feedbackSubmit">
        <s:radio name="rating" label="Rating" list="#{0:'0.0',0.5:'0.5', 1:'1.0', 1.5:'1.5', 2:'2.0', 2.5:'2.5', 3:'3.0', 3.5:'3.5', 4:'4.0', 4.5:'4.5', 5:'5.0'}"/>
        <s:textarea name="comment" label="Comment" minlength="10" placeholder="enter your comments" cols="65" rows="3"/>
        <s:submit value="Submit Feedback" />
    </s:form>
  </body>
</html>
