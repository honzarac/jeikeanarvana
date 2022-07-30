import time
from locust import task, between
from locust.contrib.fasthttp import FastHttpUser

class IkeaHomepage(FastHttpUser):
    wait_time = between(1, 4.5)

    @task(3)
    def view_hp(self):
        response = self.client.get(f"/", name="homepage")