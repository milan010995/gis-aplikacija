using Backend_App.EntityCore;
using Backend_App.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Backend_App.Services
{
    public class VehicleService
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _configuration;
        private readonly ILogger<VehicleService> _logger;
        private readonly PostgreDbContext _postgreDbContext;
        private List<VehiclePoint> _vehicleList = null;

        public VehicleService(
            ILogger<VehicleService> logger,
            IWebHostEnvironment hostingEnvironment,
            PostgreDbContext dbContext,
            IConfiguration configuration)
        {

            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
            _postgreDbContext = dbContext;
            _configuration = configuration;

            bool ImportData = configuration.GetValue<bool>("ImportData");
            if (ImportData)
                LoadData();
        }

        public void LoadData()
        {
            StreamReader streamReader = null;
            _vehicleList = new List<VehiclePoint>();
            string path = Path.Combine(_hostingEnvironment.ContentRootPath, "Data\\AVL_DataPoints.txt");
            try
            {
                int i = 0;
                string line = string.Empty;
                using (streamReader = new StreamReader(path))
                {
                    Task previousInsert = null;
                    line = streamReader.ReadLine();
                    while ((line = streamReader.ReadLine()) != null)
                    {
                        string[] parameters = line.Split('\t');
                        var point = new VehiclePoint()
                        {
                            VID = Int32.Parse(parameters[0]),
                            Valid = Convert.ToInt32(parameters[1]) > 0 ? true : false,
                            DateTime = DateTime.Parse(parameters[2]),
                            Lat = Double.Parse(parameters[3]),
                            Lon = Double.Parse(parameters[4]),
                            Speed = Double.Parse(parameters[5]),
                            Course = Double.Parse(parameters[6])
                        };

                        _postgreDbContext.Add<VehiclePoint>(point);
                        i++;

                        if (i % 20 == 0)
                        {
                            if (previousInsert != null)
                                previousInsert.Wait();

                            previousInsert = _postgreDbContext.SaveChangesAsync();
                        }
                    }
                    _postgreDbContext.SaveChanges();
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "VehicleService");
            }
            finally
            {
                if (streamReader != null)
                {
                    streamReader.Close();
                    streamReader.Dispose();
                }
            }
        }

        public IList<VehiclePoint> GetByVehicleId(int vehicleId)
        {
            return _vehicleList.Where(x => x.VID == vehicleId).ToList();
        }

        public IList<VehiclePoint>GetVehiclePointsFirst(int vehicleId, int count)
        {
          

          return _postgreDbContext.VehiclePointDbSet
                .Where(v => v.VID == vehicleId)
                .Take(count)
                .ToList();
        }
    }
}
