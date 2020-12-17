package edu.sjsu.cmpe275.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * AOP reference - https://www.youtube.com/watch?v=RVvKPP5HyaA&ab_channel=JavaTechie
 */
@Aspect
@Component
public class LoggingAdvice{

    private static Logger log = LoggerFactory.getLogger(LoggingAdvice.class);

    @Pointcut(value = "execution(* edu.sjsu.cmpe275.*.*.*(..))")
    public void myPointcut(){

    }

    @Around("myPointcut()")
    public Object appLogger(ProceedingJoinPoint pjp) throws Throwable {
        String methodName = pjp.getSignature().getName();
        String className = pjp.getTarget().getClass().getName();
        Object[] args = pjp.getArgs();

        // NOTE: (Bhavana) Please do not change this to use ObjectMapper,
        // as its causing infinite loop with spring security objects.
        log.info("Method invoked: {} of Class: {} -- Arguments: {}", methodName, className, args);
        Object object = pjp.proceed();
        log.info("Method invoked: {} of Class: {} -- Repsonse: {}", methodName, className, object);
        return object;
    }
}