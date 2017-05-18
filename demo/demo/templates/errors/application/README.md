# ApplicationError templates
The ApplicationError class contains a code parameter when raising exceptions, such as:

```
raise ApplicationError('Friendly message here', 'E102', 400)
```

If this exception goes uncaught in your code, it will bubble up to the application  error handler. At this point, it will try to find a template named `E102.html` in this folder to allow you to write custom error pages on a per error code basis.

If it cannot find this template, it will fall back to `application.html` and show a generic message.

Do not feel you have to make custom templates for every error code. This is an _optional feature_, not a requirement!
