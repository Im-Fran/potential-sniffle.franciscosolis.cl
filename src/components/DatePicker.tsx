import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parse, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { convertirDiaSemana } from '../lib/time';
import type { Profesional, Sucursal } from '../types/domain';

interface DatePickerProps {
  selectedDate?: string;
  onDateSelect: (fecha: string) => void;
  minDate?: string;
  maxDate?: string;
  profesional?: Profesional;
  sucursal?: Sucursal;
}

export function DatePicker({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  profesional,
  sucursal
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) {
      return parse(selectedDate, 'yyyy-MM-dd', new Date());
    }
    return new Date();
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const isDateDisabled = (date: Date) => {
    // Verificar fecha mínima
    if (minDate && isBefore(date, parse(minDate, 'yyyy-MM-dd', new Date()))) {
      return true;
    }

    // Verificar fecha máxima
    if (maxDate && isAfter(date, parse(maxDate, 'yyyy-MM-dd', new Date()))) {
      return true;
    }

    // Verificar si el profesional tiene turnos en este día
    if (profesional && sucursal) {
      const diaSemana = convertirDiaSemana(date.getDay());
      const tieneTurno = profesional.turnos.some(
        turno => turno.diaSemana === diaSemana && turno.sucursalId === sucursal.id
      );

      if (!tieneTurno) {
        return true;
      }
    }

    return false;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    const fechaStr = format(date, 'yyyy-MM-dd');
    onDateSelect(fechaStr);
  };

  // Generar días del calendario
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lunes como primer día
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return isSameDay(date, parse(selectedDate, 'yyyy-MM-dd', new Date()));
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-slate-100 rounded-md transition-colors"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>

        <h3 className="text-lg font-semibold text-slate-900">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-slate-100 rounded-md transition-colors"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((dia, index) => (
          <div key={index} className="h-8 flex items-center justify-center text-sm font-medium text-slate-600">
            {dia}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const disabled = isDateDisabled(day);
          const selected = isSelected(day);
          const today = isToday(day);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              className={`
                h-10 w-full flex items-center justify-center text-sm rounded-md transition-colors
                ${!isCurrentMonth 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : disabled
                    ? 'text-slate-400 cursor-not-allowed'
                    : selected
                      ? 'bg-blue-600 text-white font-medium'
                      : today
                        ? 'bg-blue-100 text-blue-700 font-medium hover:bg-blue-200'
                        : 'text-slate-700 hover:bg-slate-100'
                }
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 rounded-sm" />
            <span>Hoy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-sm" />
            <span>Seleccionado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-300 rounded-sm" />
            <span>No disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
}
