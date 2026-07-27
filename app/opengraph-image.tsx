import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'Ichsanul Amal | Data Engineer & System Architect';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#09090b',
          color: '#f4f4f5',
          fontFamily: 'monospace',
          padding: '60px',
          border: '12px solid #18181b',
          position: 'relative',
        }}
      >
        {/* Top Header Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(0, 225, 207, 0.1)',
              border: '1px solid #00e1cf',
              color: '#00e1cf',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '2px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#00e1cf',
                display: 'flex',
              }}
            />
            NICHSEDGE // DATA ARCHIVE
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '16px',
              color: '#a1a1aa',
              letterSpacing: '1px',
            }}
          >
            CMH / BDG / JKT // INDONESIA
          </div>
        </div>

        {/* Main Content Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#ffffff',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-1px',
            }}
          >
            ICHSANUL AMAL
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: '#00e1cf',
              margin: 0,
              fontWeight: 600,
            }}
          >
            Data Engineer & System Architect
          </p>
          <p
            style={{
              fontSize: '20px',
              color: '#a1a1aa',
              margin: 0,
              maxWidth: '850px',
              lineHeight: 1.4,
            }}
          >
            Scalable Data Lakes • High-Throughput ETL/ELT • BigQuery & PostgreSQL • dbt Data Modeling • Airflow Orchestration
          </p>
        </div>

        {/* Bottom Tech Pills Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid #27272a',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Python', 'SQL', 'dbt', 'BigQuery', 'Airflow', 'PostgreSQL'].map(
              (tech) => (
                <div
                  key={tech}
                  style={{
                    display: 'flex',
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    color: '#e4e4e7',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  {tech}
                </div>
              )
            )}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '16px',
              color: '#71717a',
            }}
          >
            nichsedge.github.io
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
