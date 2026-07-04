package com.omar.yaladars.child;

import com.omar.yaladars.UserManagement.User;
import com.omar.yaladars.UserManagement.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChildService {

    private final ChildRepository childRepository;
    private final UserRepository userRepository;

    public ChildService(ChildRepository childRepository, UserRepository userRepository) {
        this.childRepository = childRepository;
        this.userRepository = userRepository;
    }

    public ChildDTO createChild(ChildDTO dto) {
        User parent = userRepository.findById(dto.getParentId())
                .orElseThrow(() -> new RuntimeException("Parent not found: " + dto.getParentId()));

        Child child = new Child();
        child.setParent(parent);
        child.setName(dto.getName());
        child.setAge(dto.getAge());
        child.setGrade(dto.getGrade());
        child.setSubjects(dto.getSubjects());

        return new ChildDTO(childRepository.save(child));
    }

    public List<ChildDTO> getChildrenByParent(UUID parentId) {
        return childRepository.findByParentId(parentId)
                .stream().map(ChildDTO::new).collect(Collectors.toList());
    }

    public ChildDTO getChildById(UUID id) {
        return new ChildDTO(childRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Child not found: " + id)));
    }

    public ChildDTO updateChild(UUID id, ChildDTO dto) {
        Child child = childRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Child not found: " + id));
        child.setName(dto.getName());
        child.setAge(dto.getAge());
        child.setGrade(dto.getGrade());
        child.setSubjects(dto.getSubjects());
        return new ChildDTO(childRepository.save(child));
    }

    public void deleteChild(UUID id) {
        childRepository.deleteById(id);
    }
}
