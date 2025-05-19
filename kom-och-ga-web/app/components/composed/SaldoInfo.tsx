import {Card, CardHeader, CardTitle, CardContent} from '../ui/card/Card';
interface SaldoInfoProps {
   flexSaldo: number;
   semesterSaldo: number;
   kompSaldo: number;
}
const formatHoursToHHMM = (decimalHours: number): string => {
   const sign = decimalHours >= 0 ? '+' : '–';
   const abs = Math.abs(decimalHours);
   const hours = Math.floor(abs);
   const minutes = Math.round((abs - hours) * 60);
   return `${sign} ${hours}:${minutes.toString().padStart(2, '0')}`;
};
const SaldoInfo = ({flexSaldo, semesterSaldo, kompSaldo}: SaldoInfoProps) => {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Ditt Saldo</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-col gap-1">
            <span className="text-xs">Flexsaldo : {formatHoursToHHMM(flexSaldo)}</span> <span className="text-xs"> Semstersaldo : {semesterSaldo}</span> <span className="text-xs">Kompsaldo : {formatHoursToHHMM(kompSaldo)}</span>
         </CardContent>
      </Card>
   );
};

export default SaldoInfo;
