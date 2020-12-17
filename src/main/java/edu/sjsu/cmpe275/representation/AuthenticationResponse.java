package edu.sjsu.cmpe275.representation;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";

    public AuthenticationResponse(String accessToken) {
        this.accessToken = accessToken;
    }
}
