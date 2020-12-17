package edu.sjsu.cmpe275.security;

import edu.sjsu.cmpe275.dao.User;
import edu.sjsu.cmpe275.dao.enums.RegistrationType;
import edu.sjsu.cmpe275.repository.UserRepository;
import edu.sjsu.cmpe275.security.oauthuser.OAuth2UserInfo;
import edu.sjsu.cmpe275.security.oauthuser.OAuth2UserInfoMapper;
import edu.sjsu.cmpe275.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.UUID;

/**
 * Implementing Spring Security's OAuth2 Users service, which maps the standard providers like
 * google, facebook into DirectExchange's user's data.
 */
@Service
public class DirectExchangeOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return fetchOAuth2UserOfDirectExchange(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User fetchOAuth2UserOfDirectExchange(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoMapper
                .getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
        if(StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationException(new OAuth2Error("AUTHENTICATION_USER_NO_EMAIL"));
        }
        RegistrationType type = RegistrationType
                .fromString(oAuth2UserRequest.getClientRegistration().getRegistrationId());
        User user = userRepository.findByEmailId(oAuth2UserInfo.getEmail());
        if(user != null) {
            if(user.getRegistrationType() != type) {
                throw new OAuth2AuthenticationException(new OAuth2Error("AUTHENTICATED_USER_DIFFERENT_PROVIDER",
                        "User is already registered using " +
                        user.getRegistrationType() + " Please use your " + user.getRegistrationType() +
                        " account to login.", null));
            }
        } else {
            user = registerNewUser(oAuth2UserInfo, type);
        }

        // TODO: (Bhavana) Do we need a wrapper on oAuth2User?
        return oAuth2User;
    }

    private User registerNewUser(OAuth2UserInfo oAuth2UserInfo,
                                 RegistrationType registrationType) {
        String nickName = registrationType.getValue() + '_' +UUID.randomUUID().toString().substring(1, 10);
        return authService.registerUser(oAuth2UserInfo.getEmail(), nickName, registrationType);
    }

}
