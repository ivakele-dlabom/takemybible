package com.takemybible.backend.controller.cross_reference;

import com.takemybible.backend.dto.CrossReferenceDto;
import com.takemybible.backend.dto.NewCrossReferenceInputDto;
import com.takemybible.backend.service.CrossReferenceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.takemybible.backend.entity.CrossReference;
import com.takemybible.backend.repository.CrossReferenceRepository;

import java.util.List;

@RestController
@RequestMapping("/api/kjv/cross-references")
public class CrossReferenceController {

    
    private final CrossReferenceRepository crossReferenceRepository;
    private final CrossReferenceService crossReferenceService;
    public CrossReferenceController(CrossReferenceRepository crossReferenceRepository,  CrossReferenceService crossReferenceService) {
        this.crossReferenceRepository = crossReferenceRepository;
        this.crossReferenceService = crossReferenceService;
    }

    @PostMapping("/new")
    public ResponseEntity<CrossReference> newCrossReference(@RequestBody NewCrossReferenceInputDto newCrossReferenceInputDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(crossReferenceService.create(newCrossReferenceInputDto));
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
