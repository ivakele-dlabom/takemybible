package com.takemybible.backend.service;

import com.takemybible.backend.dto.NewCrossReferenceInputDto;
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

    public CrossReference create(NewCrossReferenceInputDto newCrossReferenceInputDto) {
        CrossReference crossReference = new CrossReference();
        crossReference.setFromBook(newCrossReferenceInputDto.fromBook());
        crossReference.setToBook(newCrossReferenceInputDto.toBook());
        crossReference.setVotes(0);
        crossReference.setFromChapter(newCrossReferenceInputDto.fromChapter());
        crossReference.setToChapter(newCrossReferenceInputDto.toChapter());
        crossReference.setToVerse(newCrossReferenceInputDto.toVerse());
        crossReference.setToVerseEnd(newCrossReferenceInputDto.toVerseEnd());
        crossReference.setToVerseStart(newCrossReferenceInputDto.toVerseStart());
        crossReference.setFromVerse(newCrossReferenceInputDto.fromVerse());
        crossReferenceRepository.save(crossReference);
        return crossReference;
    }
}
