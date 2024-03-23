<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="/struts-tags" prefix="s" %>

<!DOCTYPE html>
<html>
<style>
    div.entry {
        background-color: #6f99f2;
        width: 600px;
        height: 200px;
        border: 4px solid black;
        border-radius: 5px;
        padding: 5px;
    }

    div.rating {
        background-color: #6f99f2;
        width: 500px;
        height: 50px;
        border: 2px solid black;
        padding: 5px;
        margin: 0 45px;
    }

</style>


<head>
	<meta charset="UTF-8">
	<title>My Runs</title>
</head>

<body>
	<h1> Runs History</h1>
    <h2> Today </h2>
    <div class="entry">
        <h3 style="margin-block-start: auto; margin-block-end: auto;"><span style="font-weight:bold; float: left;">
            Morning Run with Jim :)
        </span>
        <span style="float: right;"> Share | Favourite </span></h3>
        <br>
        <p> wanted to do 5k at first but did 10 instead :p </p>
        <h2><a href="<s:url action='feedback'/>"> Rate this run!</a></h2>
        <br>

        <h2>
        <span style="display:inline-block; width: 196px; text-align: center; margin: 0;">icon1: value 1</span>
        <span style="display:inline-block; width: 196px; text-align: center; margin: 0;">icon2: value 2</span>
        <span style="display:inline-block; width: 196px; text-align: center; margin: 0;">icon3: value 3</span>
        </h2>

    </div>

    <h2> Today </h2>
    <div class="entry">
        <h3 style="margin-block-start: auto; margin-block-end: auto;"><span style="font-weight:bold; float: left;">
            Solo Evening Walk
        </span>
        <span style="float: right;"> Share | Favourite </span></h3>
        <br>
        <p> good vibes after work! </p>
        <div class="rating">
            <span>Me</span>
            <span style="float: right; padding-right: 20px;">stars graphic : (4.0)</span>

            <br>

            <p>I love the scenery along this route!</p>
        </div>

        <br>

        <h2>
        <span style="display:inline-block; width: 196px; text-align: center; margin: 0;">icon1: value 1</span>
        <span style="display:inline-block; width: 196px; text-align: center; margin: 0;">icon2: value 2</span>
        <span style="display:inline-block; width: 196px; text-align: center; margin: 0;">icon3: value 3</span>
        </h2>

    </div>
</body>
