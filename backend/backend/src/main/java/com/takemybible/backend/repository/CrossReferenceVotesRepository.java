package com.takemybible.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.takemybible.backend.entity.CrossReferenceVotes;

public interface CrossReferenceVotesRepository extends JpaRepository<CrossReferenceVotes, Long> {
    
    CrossReferenceVotes  findOneByUserIdAndCrossReferenceId(Long userId, Long crossRefenceId);
}
