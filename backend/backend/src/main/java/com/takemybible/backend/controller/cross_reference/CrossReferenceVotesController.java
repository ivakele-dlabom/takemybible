package com.takemybible.backend.controller.cross_reference;

import com.takemybible.backend.service.CrossReferenceService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.takemybible.backend.entity.CrossReferenceVotes;
import com.takemybible.backend.repository.CrossReferenceVotesRepository;

@Slf4j
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

    /**
     * @param voteValue is always either 1 or -1 indicating up or down vote
     */
    @PostMapping("/{crossReferenceId}/{userId}/{voteValue}")
public ResponseEntity<Void> makeVote(
        @PathVariable Long crossReferenceId,
        @PathVariable Long userId,
        @PathVariable Integer voteValue) {

    CrossReferenceVotes existing =
            crossReferenceVotesRepository.findOneByUserIdAndCrossReferenceId(userId, crossReferenceId);

    if (voteValue == -1 ) {
        log.debug("making a down vote");
    } else {
        log.debug("making an up vote");
    }
    if (existing == null) {
        // New vote
        crossReferenceVotesRepository.save(new CrossReferenceVotes(userId, crossReferenceId, voteValue));
        crossReferenceService.updateVotes(crossReferenceId, voteValue);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    if (!existing.getValue().equals(voteValue)) {
        // Switching up <-> down
        existing.setValue(voteValue);
        crossReferenceVotesRepository.save(existing);
        crossReferenceService.updateVotes(crossReferenceId, voteValue * 2);
    } else {
        // Same vote again: undo it
        crossReferenceVotesRepository.delete(existing);
        crossReferenceService.updateVotes(crossReferenceId, -voteValue);
    }

    return ResponseEntity.noContent().build();
}
}
