package com.takemybible.backend.service;

import com.takemybible.backend.dto.NewCrossReferenceInputDto;
import com.takemybible.backend.entity.CrossReference;
import com.takemybible.backend.entity.CrossReferenceExtras;
import com.takemybible.backend.repository.CrossReferenceExtrasRepository;
import com.takemybible.backend.repository.CrossReferenceRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CrossReferenceService {
    private final CrossReferenceRepository crossReferenceRepository;
    private final CrossReferenceExtrasRepository crossReferenceExtrasRepository;

    public CrossReferenceService (CrossReferenceRepository crossReferenceRepository, CrossReferenceExtrasRepository crossReferenceExtrasRepository) {
        this.crossReferenceRepository = crossReferenceRepository;
        this.crossReferenceExtrasRepository = crossReferenceExtrasRepository;
    }

    public void updateVotes(Long crossReferenceId, Integer value) {
        Optional<CrossReference> crossReference = crossReferenceRepository.findById(crossReferenceId);
        crossReference.ifPresent(reference ->{
            reference.setVotes(reference.getVotes() + value);
            crossReferenceRepository.save(reference);
        });

    }

    public CrossReference create(NewCrossReferenceInputDto newCrossReferenceInputDto) {

        // saving the reference
        CrossReference crossReference = getCrossReference(newCrossReferenceInputDto);
        crossReferenceRepository.save(crossReference);

        // creating the extras
        CrossReferenceExtras extras = new CrossReferenceExtras();
        extras.setCrossReference( crossReference );
        extras.setConfidence(newCrossReferenceInputDto.confidence());
        extras.setConnectionType(newCrossReferenceInputDto.connectionType());
        extras.setThemeTags(newCrossReferenceInputDto.themeTags());
        crossReferenceExtrasRepository.save(extras);

        return crossReference;
    }

    private static @NonNull CrossReference getCrossReference(NewCrossReferenceInputDto newCrossReferenceInputDto) {
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
        return crossReference;
    }
}
