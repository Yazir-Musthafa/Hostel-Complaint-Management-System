
package com.hostel.complaint.entity;

public class Student extends User {

    private String studentId;
    private String room;
    private String block;

    public Student(String firebaseUid, String name, String email, String studentId, String room, String block) {
        super(firebaseUid, name, email, Role.STUDENT);
        this.studentId = studentId;
        this.room = room;
        this.block = block;
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }

    @Override
    public void performRoleSpecificAction() {
        System.out.println("Student action: Submit complaints or view status.");
    }

    @Override
    public void printUserInfo() {
        super.printUserInfo();
        System.out.println("Student ID: " + studentId + ", Room: " + room + ", Block: " + block);
    }
}
