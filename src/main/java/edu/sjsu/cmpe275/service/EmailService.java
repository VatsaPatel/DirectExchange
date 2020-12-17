package edu.sjsu.cmpe275.service;

import edu.sjsu.cmpe275.config.AppConfig;
import lombok.Synchronized;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

/**
 * Email service to send email's via gmail smtp server
 * Reference: https://mkyong.com/java/javamail-api-sending-email-via-gmail-smtp-example/
 */
@Service
@Slf4j
public class EmailService {

    private Session session;

    @Autowired
    private AppConfig appConfig;

    public boolean sendEmail(@NonNull String emailId,
                             @NonNull String name,
                             @NonNull String emailVerificationCode) {

        try {

            // If a test email is set up in the application properties, send email to that instead all the time.
            if (appConfig.getEmail() != null && StringUtils.hasText(appConfig.getEmail().getTestEmail())) {
                emailId = appConfig.getEmail().getTestEmail();
            }

            Message message = new MimeMessage(getSession());
            message.setFrom(new InternetAddress(appConfig.getEmail().getUsername()));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(emailId)
            );
            message.setSubject("DirectExchange - Please Verify Your Email!");
            message.setText(
                    String.format("Dear %s,"
                                    + "\n\n Please verify your email by pasting this code"
                                    + "\n\n Code: %s",
                            name, emailVerificationCode)
//                    String.format("Dear %s,"
//                                    + "\n\n Please verify your email by clicking on this link"
//                                    + "\n\n %s/auth/verify?code=%s",
//                            name, appConfig.getBaseUrl(), emailVerificationCode)
            );

            Transport.send(message);
            log.info("Successfully send email to {}", emailId);
            return true;

        } catch (MessagingException e) {
            log.error("Unable to send email for email {}", emailId, e);
            return false;
        }
    }

    @Synchronized
    private Session getSession() {
        if (session == null) {
            Properties prop = new Properties();
            prop.put("mail.smtp.host", "smtp.gmail.com");
            prop.put("mail.smtp.port", "465");
            prop.put("mail.smtp.auth", "true");
            prop.put("mail.smtp.socketFactory.port", "465");
            prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

            this.session = Session.getInstance(prop,
                    new javax.mail.Authenticator() {
                        protected PasswordAuthentication getPasswordAuthentication() {
                            return new PasswordAuthentication(
                                    appConfig.getEmail().getUsername(),
                                    appConfig.getEmail().getPassword());
                        }
                    });
        }
        return session;
    }



    public boolean sendCounterOfferEmail(@NonNull String senderName, @NonNull String emailId, @NonNull String receiverName, @NonNull String srcCurrency, @NonNull Float remitAmount) {

        try {

            // If a test email is set up in the application properties, send email to that instead all the time.
            if (appConfig.getEmail() != null && StringUtils.hasText(appConfig.getEmail().getTestEmail())) {
                emailId = appConfig.getEmail().getTestEmail();
            }

            Message message = new MimeMessage(getSession());
            message.setFrom(new InternetAddress(appConfig.getEmail().getUsername()));
            message.setRecipients(
                Message.RecipientType.TO,
                InternetAddress.parse(emailId)
            );
            message.setSubject("DirectExchange - New Counter Offer!");
            message.setText(
                String.format("Dear %s,"
                        + "\n\n %s has sent you a new counter offer for your initial offer - %s %3.14f"
                        + "\n\n The offer expires in 5 minutes. Please login to view more details.",
                    receiverName, senderName, srcCurrency, remitAmount)
            );

            Transport.send(message);
            log.info("Successfully send email to {}", emailId);
            return true;

        } catch (MessagingException e) {
            log.error("Unable to send email for email {}", emailId, e);
            return false;
        }
    }

    public boolean sendTransactionEmail(@NonNull String senderName, @NonNull String emailId, @NonNull String receiverName, @NonNull String srcCurrency, @NonNull Float remitAmount) {

        try {

            // If a test email is set up in the application properties, send email to that instead all the time.
            if (appConfig.getEmail() != null && StringUtils.hasText(appConfig.getEmail().getTestEmail())) {
                emailId = appConfig.getEmail().getTestEmail();
            }

            System.out.println("In here!\n\n\n" + emailId);

            Message message = new MimeMessage(getSession());
            message.setFrom(new InternetAddress(appConfig.getEmail().getUsername()));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(emailId)
            );
            message.setSubject("DirectExchange - Complete Offer Transaction!");
            message.setText(
                    String.format("Dear %s,"
                                    + "\n\n %s has accepted your initial offer - %s %.2f"
                                    + "\n\n Please complete the transaction in 10 minutes otherwise it will expire!",
                            receiverName, senderName, srcCurrency, remitAmount)
            );

            Transport.send(message);
            log.info("Successfully send email to {}", emailId);
            return true;

        } catch (MessagingException e) {
            log.error("Unable to send email for email {}", emailId, e);
            return false;
        }
    }

    public boolean sendCustomNotification(@NonNull String userName, @NonNull String emailId, @NonNull String emailSubject, @NonNull String emailMessage) {

        try {

            // If a test email is set up in the application properties, send email to that instead all the time.
            if (appConfig.getEmail() != null && StringUtils.hasText(appConfig.getEmail().getTestEmail())) {
                emailId = appConfig.getEmail().getTestEmail();
            }

            Message message = new MimeMessage(getSession());
            message.setFrom(new InternetAddress(appConfig.getEmail().getUsername()));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(emailId)
            );
            message.setSubject(emailSubject);
            message.setText(
                    String.format("Dear %s,\n\n" + emailMessage, userName)
            );

            Transport.send(message);
            log.info("Successfully send email to {}", emailId);
            return true;

        } catch (MessagingException e) {
            log.error("Unable to send email for email {}", emailId, e);
            return false;
        }
    }

    public boolean sendRejectCounterOfferEmail(@NonNull String rejectMsgFromUser,@NonNull String rejectMsgToEmail) {

        try {
//            log.info("inside reject test mail: {} --- {}", rejectMsgFromUser, rejectMsgToEmail);
            // If a test email is set up in the application properties, send email to that instead all the time.
            if (appConfig.getEmail() != null && StringUtils.hasText(appConfig.getEmail().getTestEmail())) {
                rejectMsgToEmail = appConfig.getEmail().getTestEmail();
            }

            Message message = new MimeMessage(getSession());
            message.setFrom(new InternetAddress(appConfig.getEmail().getUsername()));
            message.setRecipients(
                Message.RecipientType.TO,
                InternetAddress.parse(rejectMsgToEmail)
            );
            message.setSubject("DirectExchange - Counter Offer Rejected!");
            message.setText(
                String.format("Dear User,"
                        + "\n\n %s has rejected your recent counter offer."
                        + "\n\n Please login to view more details.",
                    rejectMsgFromUser)
            );

            Transport.send(message);
            log.info("Successfully send email to {}", rejectMsgToEmail);
            return true;

        } catch (MessagingException e) {
            log.error("Unable to send email for email {}", rejectMsgToEmail, e);
            return false;
        }
    }


    public boolean sendMessageNotification(@NonNull String senderName,@NonNull String recieverName, @NonNull String emailId, @NonNull String emailMessage)  {
        try {
            // If a test email is set up in the application properties, send email to that instead all the time.
            if (appConfig.getEmail() != null && StringUtils.hasText(appConfig.getEmail().getTestEmail())) {
                emailId = appConfig.getEmail().getTestEmail();
            }


            Message message = new MimeMessage(getSession());
            message.setFrom(new InternetAddress(appConfig.getEmail().getUsername()));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(emailId)
            );
            message.setSubject(String.format("Direct Exchange - You have a message from %s", senderName));
            message.setText(
                    String.format("Dear %s,\n\n" + emailMessage, recieverName)
            );

            Transport.send(message);
            log.info("Successfully send email to {}", emailId);
            return true;

        } catch (MessagingException e) {
            log.error("Unable to send email for email {}", emailId, e);
            return false;
        }
    }
}
