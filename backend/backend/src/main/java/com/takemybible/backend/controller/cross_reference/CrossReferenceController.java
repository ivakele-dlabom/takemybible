package com.takemybible.backend.controller.cross_reference;

import com.takemybible.backend.dto.CrossReferenceDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.takemybible.backend.entity.CrossReference;
import com.takemybible.backend.repository.CrossReferenceRepository;

import java.util.List;

@RestController
@RequestMapping("/api/kjv/cross-references")
public class CrossReferenceController {

    
    private final CrossReferenceRepository crossReferenceRepository;
    public CrossReferenceController(CrossReferenceRepository crossReferenceRepository) {
        this.crossReferenceRepository = crossReferenceRepository;
    }

    @GetMapping("/{bookName}/{chapterNumber}/{verse}")
    public ResponseEntity<List<CrossReferenceDto>> getCrossReferences(
            @RequestParam(value = "userId", defaultValue = "-1") Long userId,
            @PathVariable String bookName,
            @PathVariable Integer chapterNumber,
            @PathVariable Integer verse
    ) {

        if (userId == -1) {
            // cross-references without userVotes
            List<CrossReference> crossReferences = crossReferenceRepository.findByFromBookAndFromChapterAndFromVerse(bookName, chapterNumber, verse);
            return ResponseEntity.ok(crossReferences.stream().map((crossReference -> new CrossReferenceDto(crossReference.getId(),
                    crossReference.getFromBook(),
                    crossReference.getFromChapter(),
                    crossReference.getFromVerse(),
                    crossReference.getToBook(),
                    crossReference.getToChapter(),
                    crossReference.getToVerseStart(),
                    crossReference.getToVerseEnd(),
                    crossReference.getVotes(),
                    0
            ))).toList());
        }
        List<CrossReferenceDto> crossReferenceDto = crossReferenceRepository.findWithUserVote(bookName, chapterNumber, verse, String.valueOf(userId));

        return  ResponseEntity.ok(crossReferenceDto);
    }
}
