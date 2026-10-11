package com.takemybible.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.takemybible.backend.entity.CrossReferenceVotes;
import com.takemybible.backend.entity.CrossReferenceVotesId;

public interface CrossReferenceVotesRepository extends JpaRepository<CrossReferenceVotes, CrossReferenceVotesId> {
    
    CrossReferenceVotes  findOneByUserIdAndCrossReferenceId(Long userId, Long crossRefenceId);
}
