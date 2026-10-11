package com.takemybible.backend.entity;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrossReferenceVotesId implements Serializable {
    private Long userId;            // names must match the entity's @Id fields exactly
    private Long crossReferenceId;
}