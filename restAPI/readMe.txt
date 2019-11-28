ResAPI
Kald til API:
localhost:8080 index.html side til brug af post/add til at booke et lokale
localhost:8080/rooms?key=123 (Viser Alle Lokaler)
localhost:8080/booking?key=123 (Viser alle bookinger i dag)
localhost:8080/booking?key=123&day=14 (Viser alle bookinger den 14 i denne måned)
localhost:8080/booking?key=123&month=11 (Viser alle bookinger dags dato i måned 11)
localhost:8080/booking?key=123&day=24&month=12 (Viser alle bookinger den 24 i 12)
localhost:8080/booking?key=123&day=6&month=7&year=2020 (Viser alle bookinger den 6-7-2020)
localhost:8080/add?key=123 (Post her til for at adde en bookning, Felter der skal bruges LokaleId,FraDato,TilDato,FraTime,TilTime,Ansvarlig)