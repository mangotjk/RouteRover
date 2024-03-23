package myRuns;

import com.opensymphony.xwork2.ActionSupport;

public class Feedback extends ActionSupport {
    private float rating=-1;
    private String comment;

    public String execute() {
		return SUCCESS;
	}

    public float getRating() {
        return rating;
    }

    public void setRating(float r) {
        rating = r;
    }

    public void setComment(String c) {
        comment = c;
    }

    public String getComment() {
        return comment;
    }

    public void validate() {
        if (comment.length() ==0) addFieldError("comment", "Comment cannot be empty!");
        if (rating==-1) {
            addFieldError("rating", "Please rate your run!");
        }
        else if (rating>=0.0 && rating<=5.0) {
            int r2 = (int) (rating*2);
            if (rating*2-r2 > 0) {
                addFieldError("rating", "Rating must be a multiple of 0.5!");
            }
        } else {
            addFieldError("rating", "Rating must be between 0 and 5!");
        }
    }

}
