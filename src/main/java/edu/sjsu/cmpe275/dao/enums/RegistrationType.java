package edu.sjsu.cmpe275.dao.enums;

import lombok.Getter;

public enum RegistrationType {
    GOOGLE("google"),
    FACEBOOK("facebook"),
    LOCAL("local");

    @Getter
    private String value;

    RegistrationType (String value) {
        this.value = value;
    }

    public static RegistrationType fromString(String value) {
        for (RegistrationType registrationType: values()) {
            if (registrationType.value.equalsIgnoreCase(value)) {
                return registrationType;
            }
        }
        return null;
    }

}
