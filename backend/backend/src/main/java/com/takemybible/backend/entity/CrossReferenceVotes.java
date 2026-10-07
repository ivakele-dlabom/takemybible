package com.takemybible.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cross_reference_votes")
@Data
@NoArgsConstructor
public class CrossReferenceVotes {
    @Id
    @Column(name = "user_id")
    Long userId;

    @Column(name = "cross_reference_id")
    Long crossReferenceId;

    @Column(name = "value")
    Integer value;

    public CrossReferenceVotes(Long userId, Long crossReferenceId , Integer value) {
        this.crossReferenceId = userId;
        this.crossReferenceId = crossReferenceId ;
        this.value = value;
    }

}
