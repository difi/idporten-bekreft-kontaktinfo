package no.digdir.kontaktinfo.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@Slf4j
@RequestMapping("/api")
public class AutoSubmitController {

    @GetMapping("/autosubmit")
    @ResponseBody
    public void receiveResponse(@RequestParam String gotoParam,
                                HttpServletResponse response) throws IOException {
        renderHelpingPage(response, gotoParam);
    }

    private void renderHelpingPage(HttpServletResponse response, String url) throws IOException {
        StringBuilder result = new StringBuilder();
        result.append(top(url));
        result.append(footer());
        response.setContentType(getContentType());
        response.getWriter().append(result);
    }
    private String top(String url) {
        return "<html>" +
                "<head><title>Bekreft Kontaktinformasjon</title></head>" +
                "<body onload=\"javascript:document.forms[0].submit()\">" +
                "<form target=\"_parent\" method=\"post\" action=\"" + url + "\">";
    }
    private String footer() {
        return "<noscript><input type=\"submit\" value=\"Click to redirect\"></noscript>" +
                "</form>" +
                "</body>" +
                "</html>";
    }
    private String getContentType() {
        return "text/html";
    }
}
