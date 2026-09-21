package com.takemybible.backend.controller;

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
    public ResponseEntity<List<CrossReference>> getCrossReferences(
        @PathVariable String bookName,
        @PathVariable Integer chapterNumber,
        @PathVariable Integer verse
    ) {
        List<CrossReference> crossReferences = crossReferenceRepository.findByFromBookAndFromChapterAndFromVerse(bookName, chapterNumber, verse);

        return  ResponseEntity.ok(crossReferences);
    }
}
