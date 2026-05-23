package main

import (
    "log"
    "net/http"
    "os"
)

func main() {
    fs := http.FileServer(http.Dir("/static"))
    http.Handle("/", spaHandler(fs))

    port := os.Getenv("PORT")
    if port == "" {
        port = "80"
    }

    log.Printf("Starting static server on :%s", port)
    if err := http.ListenAndServe(":"+port, nil); err != nil {
        log.Fatal(err)
    }
}

// spaHandler serves index.html for non-file routes (SPA fallback)
func spaHandler(fs http.Handler) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // Try to open the file; if it does not exist, serve index.html
        if _, err := os.Stat("/static" + r.URL.Path); os.IsNotExist(err) {
            http.ServeFile(w, r, "/static/index.html")
            return
        }
        fs.ServeHTTP(w, r)
    }
}
