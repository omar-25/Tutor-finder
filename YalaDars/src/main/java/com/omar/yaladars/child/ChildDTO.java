package com.omar.yaladars.child;

import java.time.LocalDateTime;
import java.util.UUID;

public class ChildDTO {

    private UUID id;
    private UUID parentId;
    private String name;
    private Integer age;
    private String grade;
    private String subjects;
    private LocalDateTime createdAt;

    public ChildDTO() {}

    public ChildDTO(Child child) {
        this.id = child.getId();
        this.parentId = child.getParent().getId();
        this.name = child.getName();
        this.age = child.getAge();
        this.grade = child.getGrade();
        this.subjects = child.getSubjects();
        this.createdAt = child.getCreatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getParentId() { return parentId; }
    public void setParentId(UUID parentId) { this.parentId = parentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getSubjects() { return subjects; }
    public void setSubjects(String subjects) { this.subjects = subjects; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
