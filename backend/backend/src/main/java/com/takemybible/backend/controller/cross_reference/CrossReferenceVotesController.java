package com.takemybible.backend.controller.cross_reference;

import com.takemybible.backend.service.CrossReferenceService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.takemybible.backend.entity.CrossReferenceVotes;
import com.takemybible.backend.repository.CrossReferenceVotesRepository;

@RestController
@RequestMapping("/api/cross-reference/vote")
public class CrossReferenceVotesController {

    private final CrossReferenceVotesRepository crossReferenceVotesRepository;
    private final CrossReferenceService crossReferenceService;

    public CrossReferenceVotesController(CrossReferenceVotesRepository crossReferenceVotesRepository, CrossReferenceService crossReferenceService) {
        this.crossReferenceVotesRepository = crossReferenceVotesRepository;
        this.crossReferenceService = crossReferenceService;
    }

    // const response = await fetch(`${BACKEND_BASE_URL}api/cross-reference/vote/${reference.id}/${user.userId}/${voteValue}`, {
    @PostMapping("/{crossReferenceId}/{userId}/{voteValue}")
    public ResponseEntity<CrossReferenceVotes> makeVote(
            @PathVariable Long crossReferenceId,
            @PathVariable Long userId,
            @PathVariable Integer voteValue) {

        CrossReferenceVotes existing =
                crossReferenceVotesRepository.findOneByUserIdAndCrossReferenceId(userId, crossReferenceId);

        if (existing == null) {
            CrossReferenceVotes vote = new CrossReferenceVotes(userId, crossReferenceId, voteValue);
            CrossReferenceVotes saved = crossReferenceVotesRepository.save(vote);
            crossReferenceService.updateVotes(crossReferenceId, voteValue);
            // 201 Created with the saved vote in the body
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        }

        if (!existing.getValue().equals(voteValue)) {
            existing.setValue(voteValue);
            existing = crossReferenceVotesRepository.save(existing); // save() updates when the entity already has an id
            crossReferenceService.updateVotes(crossReferenceId, voteValue);
        }

        return ResponseEntity.ok(existing);
    }
}
