package com.takemybible.backend.service;

import com.takemybible.backend.entity.CrossReference;
import com.takemybible.backend.repository.CrossReferenceRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CrossReferenceService {
    private final CrossReferenceRepository crossReferenceRepository;

    public CrossReferenceService (CrossReferenceRepository crossReferenceRepository) {
        this.crossReferenceRepository = crossReferenceRepository;
    }

    public void updateVotes(Long crossReferenceId, Integer value) {
        Optional<CrossReference> crossReference = crossReferenceRepository.findById(crossReferenceId);
        crossReference.ifPresent(reference ->{
            reference.setVotes(reference.getVotes() + value);
            crossReferenceRepository.save(reference);
        });

    }
}
