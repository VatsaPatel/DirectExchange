package edu.sjsu.cmpe275.security;

import edu.sjsu.cmpe275.dao.User;
import edu.sjsu.cmpe275.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DirectExchangeUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        User user = userRepository.findByEmailId(email);
        if (user == null) {
            throw new UsernameNotFoundException("Unable to find user with emailId " + email);
        }

        return UserAuthenticationPrincipal.create(user);
    }

    public UserDetails loadUserById(Long id) {
        User user = userRepository.findByUserId(id);
        if (user == null) {
            throw new UsernameNotFoundException("Unable to find user with userId " + id);
        }
        return UserAuthenticationPrincipal.create(user);
    }
}