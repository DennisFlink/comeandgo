import React from 'react';
import {Card, CardHeader, CardTitle} from '../ui/card/Card';

interface WelcomeCardProps {
   name: string;
}
const WelcomeCard = ({name}: WelcomeCardProps) => {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Välkommen {name}</CardTitle>
         </CardHeader>
      </Card>
   );
};

export default WelcomeCard;
