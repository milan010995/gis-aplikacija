using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Backend_App.EntityCore.Models
{
    public class SensorData
    {
        [Key]
        public int Id { get; set; }

        public int VID { get; set; }

        public DateTime DateTime { get; set; }

        public Sensor Sensor { get; set; }

        public double Value { get; set; }

        public static Sensor ParseSensorType(string sensor)
        {
            switch (sensor)
            {
                case "Battery level": return Sensor.BateryLevel;
                case "RPM": return Sensor.RPM;
                case "Ignition": return Sensor.Ignition;
                case "Odometar": return Sensor.Odometar;
                case "Backup batery voltage": return Sensor.BackupBateryVoltage;
                case "Backup batery current": return Sensor.BackupBateryCurrent;
                case "Movement sensor": return Sensor.Movement;
                case "Fuel level": return Sensor.FuelLevel;
                case "Fuel rate (MPG)": return Sensor.FuelRateMPG;
                case "Mileage": return Sensor.Mileage;
            }
            throw new Exception("Sensor does not exists");
        }
    }

    public enum Sensor
    {
        /// <summary>
        /// Battery level
        /// </summary>
        BateryLevel,
        /// <summary>
        /// RPM
        /// </summary>
        RPM,
        /// <summary>
        /// Ignition
        /// </summary>
        Ignition,
        /// <summary>
        /// Odometar
        /// </summary>
        Odometar,
        /// <summary>
        /// Backup batery current
        /// </summary>
        BackupBateryCurrent,
        /// <summary>
        /// Backup batery current
        /// </summary>
        BackupBateryVoltage,
        /// <summary>
        /// Movement
        /// </summary>
        Movement,
        /// <summary>
        /// Fuel level
        /// </summary>
        FuelLevel,
        /// <summary>
        /// Fuel rate (MPG)
        /// </summary>
        FuelRateMPG,
        /// <summary>
        /// Mileage
        /// </summary>
        Mileage
    }   
}
