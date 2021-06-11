import admin from "firebase-admin";

const config = {
  type: "service_account",
  project_id: "letstalk-3fbee",
  private_key_id: "6180b251dcef246fb5bd0e2679cd46657983ad7f",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCndyuTlmDQ4zD8\nQu1cF2Lx3F3B9o0d0mpADWX13ZkWPzTNpnaHQAXokIDW09eSQ/X2uvMTYTOGHDkE\nYFXtRBDdIzhY8MnryU54kYmjq2PuJLvFcVGirlSHe+HuyLyCkBMbvURIv90VPnFy\nOMYbzB1uKyL61OxBC0sEFotwb1Rwqk3gwQpX8oU395UXf9RbNAN/swcfpwPZ+exw\nQJlUK/dJk8DAPZrMr3nMWTGTBBT83LiHiY9wdbvdLYhVr9tf3YHWIk6boWXKqMWz\nTRGDXtFJeYdLBKoV73cBUcPvx1qbrN8nZ2k4xDuPqae1mBCTaLv9xr5946kOPOmV\n0xvTNmL9AgMBAAECggEAOssPXPbYEa4Zlg7nJ0Q8pB4SOpUVMQmc7NTnXXzJkLJr\nFuIgzdYP3PjSitl/3uWGNnOnAEBJZwWEjQFHWY/ifciuMSeENIgNyS2LTY9P+50g\n4S4qE3uxyIkZJoyKBiqP0tbNYN8fPqSYDppZDwxHrtRtKPPU5/cPhKVnmfc0BYNq\nYVg4ej3hKjMbGHmKQ5/KOugRVOmTYy3S6nnqoGKOzgJDeU4+/48DTU0+KIDvDl+z\nbBaawmWKxIfEFn7JZ8i/4XMWdgtCeyrSaCDPsNePqVAdZJSUWAlk20ZVGPnrGBm3\nJZOxPDok7/nhtwbINYMhzsXxwI/f2qe5L5qGEyjcXwKBgQDqtvwWpAyRWt2Qj9WZ\nuYVl6eHkAfuIdUSe7S9H2WAgonZoX3UABl3EtzxVCpn+m2IOfxW7sOECy0+vA69H\nmbAUuVqF+ErgiuDHhxtnMms6Ud9ln/70zuy1Nug4DvPUsGNX1EZc2UWSSKTozl2m\nv7oOSd09GK5gIxMUNWKjFCjWcwKBgQC2pvYr1d/DB4SJru2hL8aYK4ph2hWDNPDI\ndcd0fajCuYzZDZ9+uMoYgPiHZaYw75ZWbqLkp6DQvuzP/8ZJnF/GzKvV3aMvp7hP\nOnu8OOp15UYhjI8JHOlj4fQXwUK9tjpYD/pbz3AjuhEVKqjHQFgBqFI+KK32PRMU\n+gkwiNAUzwKBgFasddDCiaWPgWwlwUIAIUOuJ210UfdlHo71lVUZ74Z9l+4Y+fKl\nZzECXTQmMxGzPXWO9m6V9bF7dJRzbuGo3j346HW6Z6QdhL4JpVPpaXFi1HUJrTOn\nyf9tJDm3Q9FRxY2kZMtarHdFfig+NJUkDcfC/QDXwWTc7umygRcplZ8DAoGAcjbj\nVrPtsVIBIet98r4iTENlzByIOTygmGl16LUvE1zd41hudNpunXYAcwIwMweOlcun\nFp5vpDjPcp15S8x546FWjmyCv6j8SqbCeweILWLKQO5Y/xTSKMBBV51k86aAw1Jy\ndni3oc+XIQpE8hudLKQpkW70oTa9uO9FUdErdOcCgYEA6ZXbDBx87+/PZCuO30Au\nqxB5fHQ1c7BlBglxBpaF6T8ErYYcjDPo0Z2RQaIzFzk8CRE/EI9Ch3vfUQhC2R7E\nrjkuIeo3WQsAZ5kM92AfommzxOQwNZ73YPl5O905WIgqu5KE2dsOV5Ll2muyuPE2\nWKbZlQoYzcKWa1HSVZGf5vg=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-rvy34@letstalk-3fbee.iam.gserviceaccount.com",
  client_id: "114990333654351404884",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rvy34%40letstalk-3fbee.iam.gserviceaccount.com",
};

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(config),
});

export default admin;
