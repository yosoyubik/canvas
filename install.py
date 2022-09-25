#!/usr/bin/env python
import re
from sys import argv
from os.path import exists, dirname
from os import makedirs, system
import shutil
from time import sleep

THIS_FILE, *ARGS = argv
THIS_DIR = re.sub(r"/[^/]+$", "", THIS_FILE)
NUM_ARGS = len(ARGS)

# -------------------------check arguments are correct-------------------------

# check formatting

def arg_format_error():
    print(f"{THIS_FILE} [-w] URBIT_PIER_DESK_DIRECTORY\n(-w: flag to watch and live copy code)\n")
    exit(0)

if NUM_ARGS > 2:
    print("ERROR: too many args\n\nformat should be:")
    arg_format_error()
elif NUM_ARGS == 2 and ARGS[0] != "-w":
    print("ERROR: wrong argument format\n\nformat should be:")
    arg_format_error()

# check path arg is absolute and exists

def check_path_is_abs_and_exists(arg: str):
    if not arg.startswith("/"):
        print("ERROR: can't use relative paths for URBIT_PIER_DESK_DIRECTORY, only absolute paths")
        exit(0)
    if not exists(arg):
        print("ERROR: URBIT_PIER_DESK_DIRECTORY file does not exist")
        exit(0)
    if arg.endswith("/"):
        arg = arg[:-1]
    return arg

PIER_DESK = check_path_is_abs_and_exists(ARGS[NUM_ARGS - 1])

# ---------------------------download urbit dev desks---------------------------

# check if urbit folder is already cloned
if not exists("urbit"):
    # if not found, download
    print("downloading urbit dev desks...\n")
    system(f"""
        cd {THIS_DIR}
        git clone --filter=blob:none --sparse https://github.com/urbit/urbit.git
        cd urbit
        git sparse-checkout add pkg/base-dev
        git sparse-checkout add pkg/garden-dev""")
else:
    # if found, update
    print("updating urbit dev desks...\n")
    system(f"""
        cd {THIS_DIR}
        cd urbit
        git pull""")

# ------------parse urbit desk files to add, then copy to pier desk------------

import json
with open("./dev-desk-files.json") as f:
    j = json.load(f)
    
    def get_paths(input, paths=[], prefix=""):
        i_type = type(input)
        if i_type == dict:
            for k, v in input.items():
                if type(v) == str:
                    paths.append(prefix + k)
                else:
                    if k == "/":
                        paths = get_paths(v, paths, prefix)
                    else:
                        paths = get_paths(v, paths, prefix + k + "/")
        elif i_type == list:
            for e in input:
                if type(e) == str:
                    paths.append(prefix + e)
                else:
                    print("ERROR: wrong data type in array of dev-desk-files.json")
                    print("\nonly use strings in arrays")
        else:
            print("ERROR: wrong data type in dev-desk-files.json")
            print("\nonly use object, array, or string")
        return paths
    
    paths = get_paths(j)
    # print(paths)
    
    system(f"rm -r {PIER_DESK}/*")
    
    for path in paths:
        # replace %base and %garden with their actual paths in the urbit github project
        path = re.sub(r"^%(base|garden)", r"/\1-dev", path)
        src_path = THIS_DIR + "/urbit/pkg" + path
        
        # rm base-dev/ and garden-dev/
        path = re.sub(r"^.*-dev", r"", path)
        dest_path = PIER_DESK + path
        
        # print(f"from: {src_path}\nto: {dest_path}")
        makedirs(dirname(dest_path), exist_ok=True)
        shutil.copy(src_path, dest_path)

# ----------------update pier desk with files from project desk----------------

# TODO: add ignore-files section to settings file (and prob change name of file to urbit.config.json)

# FIXME: temporarily adding all files bc idk which one(s) are missing
# 
# HMMMM, LOOKS LIKE I GET THE 8080 ERROR WHEN ALL FILES ARE IN TOO, SO PROB 
# ABLE TO DELETE BELOW 2 LINES
system(f"rsync -r --copy-links --exclude-from={THIS_DIR}/ignore_files.txt {THIS_DIR}/urbit/pkg/base-dev/* {PIER_DESK}/")
system(f"rsync -r --copy-links --exclude-from={THIS_DIR}/ignore_files.txt {THIS_DIR}/urbit/pkg/garden-dev/* {PIER_DESK}/")

if NUM_ARGS == 1:
    system(f"""
        rsync -r --copy-links --exclude-from={THIS_DIR}/ignore_files.txt {THIS_DIR}/canvas-desk/* {PIER_DESK}/""")
elif NUM_ARGS == 2:
    print("\nwatching for updates to project desk...")
    while True:
        sleep(0.8)
        system(f"""
            rsync -r --copy-links --exclude-from={THIS_DIR}/ignore_files.txt {THIS_DIR}/canvas-desk/* {PIER_DESK}/""")
