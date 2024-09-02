start backend: 
    export FLASK_APP=__init__.py
    export FLASK_DEBUG=1
    flask run

start frontend:
    npm start

start time: 7:20pm

business logic decisions:
- unbooked slots that have started or passed will be deleted
- coaches cannot remove slots once booked by student
- review is short and only 300 chars
- phone number will not be viewed for past appointments
- caoches can add review once the call starts
