package com.takemybible.backend.dto;

public class CommentRequest {

    private Long verseId;
    private String body;
    private Long parentCommentId;

    public CommentRequest() {}

    public CommentRequest(Long verseId, String body, Long parentCommentId) {
        this.verseId = verseId;
        this.body = body;
        this.parentCommentId = parentCommentId;
    }

    public Long getVerseId() {
        return verseId;
    }

    public void setVerseId(Long verseId) {
        this.verseId = verseId;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }
}
