using Backend_App.EntityCore.Models;
using Backend_App.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend_App.EntityCore
{
    public class PostgreDbContext : DbContext
    {
        public PostgreDbContext(DbContextOptions<PostgreDbContext> options) : base(options)
        {
        }

        public DbSet<SensorData> SensorDbSet { get; set; }
        public DbSet<VehiclePoint> VehiclePointDbSet { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasSequence<int>("VehiclePointNumbers").StartsAt(1).IncrementsBy(1);
            modelBuilder.HasSequence<int>("SensorDataNumbers").StartsAt(1).IncrementsBy(1);


            modelBuilder.Entity<SensorData>().ToTable("SensorData")
                .Property(x => x.Id).HasDefaultValueSql("nextval('\"SensorDataNumbers\"')");
            modelBuilder.Entity<VehiclePoint>().ToTable("VehiclePoint")
                .Property(x => x.Id).HasDefaultValueSql("nextval('\"VehiclePointNumbers\"')");
        }
    }
}
