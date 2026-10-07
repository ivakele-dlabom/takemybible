package com.takemybible.backend.controller;
import java.net.http.HttpResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.takemybible.backend.entity.CrossReferenceVotes;
import com.takemybible.backend.repository.CrossReferenceVotesRepository;


@Controller
@RequestMapping("/api/cross-reference/vote")
public class CrossReferenceVotesController {
    
    private final CrossReferenceVotesRepository crossReferenceVotesRepository;

    @GetMapping("/{crossReferenceId}/{userId}/{voteValue}")
    public ResponseEntity makeVote(@PathVariable  Long crossReferenceId, @PathVariable Long userId,@PathVariable Integer voteValue) {
        CrossReferenceVotes crossReferenceVotes = crossReferenceVotesRepository.findOneByUserId(userId);
        if (crossReferenceVotes == null) {
            CrossReferenceVotes vote = new CrossReferenceVotes(userId, crossReferenceId, voteValue);
            crossReferenceVotes = crossReferenceVotesRepository.save(vote);
            // how do I make the correct response
            return ResponseEntity.ok();
        } else {
            if (crossReferenceVotes.getVote != voteValue) {
                crossReferenceVotes.setVote(voteValue);
                //how do i save this change
            }
        }

    }

}
