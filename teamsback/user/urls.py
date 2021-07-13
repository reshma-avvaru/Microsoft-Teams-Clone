from os import name
from django.urls import path 

from . import views

urlpatterns = [
  path('new_group/<username>/<password>/<topic>/',views.new_group,name="new_group"),
  path('join_group/<username>/<group_id>/<password>',views.join_group,name="join_group"),
  path('get_all_groups/<username>/',views.get_all_groups,name="all_groups")
]