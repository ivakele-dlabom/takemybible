package com.takemybible.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cross_reference_votes")
@Data
@NoArgsConstructor
public class CrossReferenceVotes {
    Integer user_id;
    Integer cross_reference_id;
    Integer value;

}
