package com.omar.yaladars.child;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/children")
public class ChildController {

    private final ChildService childService;

    public ChildController(ChildService childService) {
        this.childService = childService;
    }

    @PostMapping
    public ResponseEntity<ChildDTO> createChild(@RequestBody ChildDTO dto) {
        return ResponseEntity.ok(childService.createChild(dto));
    }

    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<ChildDTO>> getChildrenByParent(@PathVariable UUID parentId) {
        return ResponseEntity.ok(childService.getChildrenByParent(parentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChildDTO> getChild(@PathVariable UUID id) {
        return ResponseEntity.ok(childService.getChildById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChildDTO> updateChild(@PathVariable UUID id, @RequestBody ChildDTO dto) {
        return ResponseEntity.ok(childService.updateChild(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChild(@PathVariable UUID id) {
        childService.deleteChild(id);
        return ResponseEntity.noContent().build();
    }
}
