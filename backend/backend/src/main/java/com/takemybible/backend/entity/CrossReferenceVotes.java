package com.takemybible.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cross_reference_votes")
@IdClass(CrossReferenceVotesId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrossReferenceVotes {
    @Id
    @Column(name = "user_id")
    Long userId;

    @Id
    @Column(name = "cross_reference_id")
    Long crossReferenceId;

    @Column(name = "value")
    Integer value;

}
