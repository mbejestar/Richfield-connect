from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Opportunity
from .serializers import OpportunitySerializer


class OpportunityViewSet(viewsets.ModelViewSet):

    queryset = Opportunity.objects.filter(
        is_active=True
    )

    serializer_class = OpportunitySerializer

    permission_classes = [
        IsAuthenticated
    ]

    def perform_create(self, serializer):

        serializer.save(
            created_by=self.request.user
        )