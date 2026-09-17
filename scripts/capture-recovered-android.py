"""Re-capture running Android views on the dedicated fresh emulator only.
Run `uv run --with pillow --no-project python scripts/capture-recovered-android.py`.
Requires emulator-5586 booted from /home/al/Projects/.captures-recovery-worker-561.
Never use a personal device, import snapshots, or seed financial/focus records.
"""
import subprocess, time, json, hashlib
from pathlib import Path
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'scripts/recovered-existing-evidence'
OUT.mkdir(exist_ok=True)
ADB=['/home/al/Android/Sdk/platform-tools/adb','-s','emulator-5586']
def adb(*args):
    r=subprocess.run(ADB+list(args),capture_output=True,check=True)
    return r.stdout

def dump(name):
    adb('shell','uiautomator','dump','/sdcard/recovered.xml')
    b=adb('shell','cat','/sdcard/recovered.xml')
    (OUT/(name+'.xml')).write_bytes(b)
    return ET.fromstring(b)

def tap_label(label, name):
    root=dump(name+'-navigation')
    candidates=[n for n in root.iter('node') if n.get('text')==label or n.get('content-desc')==label]
    if not candidates:
        raise RuntimeError(f'{label} absent: '+str([(n.get('text'),n.get('content-desc')) for n in root.iter('node')]))
    import re
    a,b,c,d=map(int,re.findall(r'\d+',candidates[0].get('bounds')))
    adb('shell','input','tap',str((a+c)//2),str((b+d)//2));time.sleep(3)

def shot(name):
    dump(name)
    b=adb('exec-out','screencap','-p')
    path=ROOT/'public/media/projects'/f'{name}.png'
    path.write_bytes(b)
    print(json.dumps({'path':str(path),'sha256':hashlib.sha256(b).hexdigest()}))

if __name__=='__main__':
    import argparse
    p=argparse.ArgumentParser()
    p.add_argument('mode',choices=['launch','shot','tap'])
    p.add_argument('arg')
    a=p.parse_args()
    if a.mode=='launch':
        project=a.arg
        package={'deepfocus':'com.sans.deepfocus','sansfinance':'com.sans.finance'}[project]
        repo=Path('/home/al/Projects')/project
        print(adb('install','-r',str(repo/'app/build/outputs/apk/debug/app-debug.apk')).decode())
        print(adb('shell','am','start','-W','-n',package+'/.MainActivity').decode())
        time.sleep(4)
        print([(n.get('text'),n.get('content-desc'),n.get('bounds')) for n in dump(project+'-initial').iter('node') if n.get('text') or n.get('content-desc')])
    elif a.mode=='tap':
        label=a.arg
        root=dump('navigation')
        candidates=[n for n in root.iter('node') if n.get('text')==label or n.get('content-desc')==label]
        if not candidates:
            raise SystemExit('not found: '+str([(n.get('text'),n.get('content-desc')) for n in root.iter('node')]))
        import re
        x1,y1,x2,y2=map(int,re.findall(r'\d+',candidates[0].get('bounds')))
        adb('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));time.sleep(3)
        print('tapped',label)
    else:
        shot(a.arg)
