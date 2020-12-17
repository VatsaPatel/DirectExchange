package edu.sjsu.cmpe275.security.oauthuser;

import edu.sjsu.cmpe275.dao.enums.RegistrationType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;

import java.util.Map;

@Slf4j
public class OAuth2UserInfoMapper {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationType, Map<String, Object> attributes) {
        RegistrationType type = RegistrationType.fromString(registrationType);;
        if (type == null) {
            log.error("Unknown client registration {}", registrationType);
            throw new OAuth2AuthenticationException(new OAuth2Error("PROVIDER_REGISTERATION_NOT_FOUND",
                    "Provider is not registered", null));
        }
        switch (type) {
            case GOOGLE:
                return new GoogleOAuth2UserInfo(attributes);
            case FACEBOOK:
                return new FacebookOAuth2UserInfo(attributes);
            default:
                throw new OAuth2AuthenticationException(new OAuth2Error("PROVIDER_REGISTERATION_NOT_FOUND",
                        "Provider is not registered", null));
        }
    }
}
